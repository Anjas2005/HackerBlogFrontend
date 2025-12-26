import NewsGrid from "../components/Home/NewsGrid"

const Home = ({
    data
}) => {
  return (
    <>
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500 mb-4">
            Top Stories
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Curated tech news, harvested in real-time.
          </p>
        </div>
        <NewsGrid data={data} />
    </>
  )
}

export default Home
