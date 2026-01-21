import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VisitorFormPage from "./VisitorFormPage"
import FormModel from "models/VisitorModel";

const VisitorEdit = () => {
  const [visitorData, setVisitorData] = useState(null)
  const [loading, setLoading] = useState(true)

  const params = useParams();

  useEffect(() => {
    const getVisitorData = async (id) => {
      try {
        setLoading(true)
        const response = await FormModel.getVisitorById(id)
        if (response && response.http_code === 200) {
          setVisitorData(response.data)
        } else {
          setVisitorData(null)
        }
      } catch (error) {
        console.error("Error fetching visitor:", error)
        setVisitorData(null)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      getVisitorData(params.id)
    }
  }, [params.id])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <VisitorFormPage visitorData={visitorData} />
  )
}

export default VisitorEdit