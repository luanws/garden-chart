import styles from './page.module.css'

interface Props {
  data: any
}

export default function Home(props: Props) {
  const { data } = props
  console.log(data)
  return (
    <main className={styles.main}>
      {data}
      <br />
      teste123
    </main>
  )
}

export async function getServerSideProps(): Promise<{ props: Props }> {
  return {
    props: {
      data: 'teste'
    }
  }
}