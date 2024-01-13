import Footer from 'client/components/footer';
import Header from 'client/components/header';
import styles from './page.module.scss';

export default async function Index() {
  return (
    <body className={styles.page}>
      <Header />
      <main>map</main>

      <Footer />
    </body>
  );
}
