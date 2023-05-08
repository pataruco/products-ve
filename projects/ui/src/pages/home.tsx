import { useStoresQuery } from '../api/operations.generated';

const Home = () => {
  const { data, error, loading } = useStoresQuery({
    variables: {
      from: {
        coordinates: {
          lat: 51.50722,
          lng: -0.1275,
        },
        distance: 2500,
      },
    },
  });

  console.log({ data });

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error : {error.message}</p>;
};

export default Home;
