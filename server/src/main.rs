use juniper::{http::GraphQLRequest, EmptySubscription, RootNode};
use postgres_types::{FromSql, ToSql};
use std::{convert::Infallible, env, sync::Arc};
use tokio_postgres::{Client, NoTls};
use warp::{http::Response, Filter};

#[derive(juniper::GraphQLObject, Debug, ToSql, FromSql)]
struct Location {
    // id: Option<String>,
    name: String,
    address: Option<String>,
}

struct QueryRoot;
struct MutationRoot;

#[juniper::graphql_object(Context = Context)]
impl QueryRoot {
    async fn location(ctx: &Context, name: String) -> juniper::FieldResult<Location> {
        // let uuid = uuid::Uuid::parse_str(&id)?;
        let row = ctx
            .client
            .query_one(
                "SELECT name, address FROM locations WHERE name = $1",
                &[&name],
            )
            .await?;
        let location = Location {
            // id: row.try_get(0)?,
            name: row.try_get(0)?,
            address: row.try_get(1)?,
        };
        Ok(location)
    }

    // async fn locations(ctx: &Context) -> juniper::FieldResult<Vec<Location>> {
    //     let rows = ctx
    //         .client
    //         .query("SELECT location_id, name FROM locations", &[])
    //         .await?;
    //     let mut locations = Vec::new();
    //     for row in rows {
    //         let id: uuid::Uuid = uuid::Uuid::parse_str(row.try_get(0)?)?;
    //         let location = Location {
    //             id: id.to_string(),
    //             name: row.try_get(1)?,
    //         };
    //         locations.push(location);
    //     }
    //     Ok(locations)
    // }
}

#[juniper::graphql_object(Context = Context)]
impl MutationRoot {
    async fn add_location(
        ctx: &Context,
        name: String,
        address: String,
    ) -> juniper::FieldResult<Location> {
        // let id = uuid::Uuid::new_v4().to_string();
        ctx.client
            .execute(
                "INSERT INTO locations (name, address) VALUES ($1, $2)",
                &[&name, &address],
            )
            .await?;
        Ok(Location {
            name,
            address: Some(address),
            // id: Some(id),
        })
    }
}

type Schema = RootNode<'static, QueryRoot, MutationRoot, EmptySubscription<Context>>;

struct Context {
    client: Client,
}

impl juniper::Context for Context {}

async fn graphql(
    schema: Arc<Schema>,
    ctx: Arc<Context>,
    req: GraphQLRequest,
) -> Result<impl warp::Reply, Infallible> {
    let res = req.execute(&schema, &ctx).await;
    let json = serde_json::to_string(&res).expect("Invalid JSON response");
    Ok(json)
}

#[tokio::main]
async fn main() {
    env::set_var("RUST_LOG", "warp_server");

    let log = warp::log("warp_server");

    let homepage = warp::path::end().map(|| {
        Response::builder()
            .header("content-type", "text/html")
            .body(format!(
                "<html><h1>juniper_warp</h1><div>visit <a href=\"/graphiql\">/graphiql</a></html>"
            ))
    });

    let (client, connection) =
        tokio_postgres::connect("postgresql://pataruco:pataruco@127.0.0.1/productsdb", NoTls)
            .await
            .unwrap();

    // The connection object performs the actual communication with the database,
    // so spawn it off to run on its own.
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    let schema = Arc::new(Schema::new(
        QueryRoot,
        MutationRoot,
        EmptySubscription::<Context>::new(),
    ));

    let schema = warp::any().map(move || Arc::clone(&schema));

    let ctx = Arc::new(Context { client });

    // Create a warp filter for the context
    let ctx = warp::any().map(move || Arc::clone(&ctx));

    let graphql_route = warp::post()
        .and(warp::path!("graphql"))
        .and(schema.clone())
        .and(ctx.clone())
        .and(warp::body::json())
        .and_then(graphql)
        .with(log);

    let graphiql_route = warp::get()
        .and(warp::path!("graphiql"))
        .and(juniper_warp::graphiql_filter("/graphql", None))
        .or(homepage)
        .with(log);

    let routes = graphql_route.or(graphiql_route);

    warp::serve(routes).run(([127, 0, 0, 1], 8000)).await;
}
