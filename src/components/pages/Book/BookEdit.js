import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import BookFormPage from "./BookFormPage";
import moment from "moment";

const BookEdit = () => {
  const [bookData, setBookData] = useState({
    title: "",
    title_en: "",
    description: "",
    description_en: "",
    publish_date: "",
    isbn: "",
  })

  const params = useParams();

  const getBookData = (id) => {
    return {
      id: 1,
      title: "a",
      title_en: "b",
      description: "aaaaaa",
      description_en: "bbbbbb",
      publish_date: moment(new Date().toISOString()).format('YYYY-MM-DD'),
      isbn: 123123123123,
    }
  }

  useEffect(() => {
    let result = getBookData(params.id)
    setBookData(result)
  }, [params])

  return (
    <BookFormPage bookData={bookData} ></BookFormPage>
  )
}

export default BookEdit