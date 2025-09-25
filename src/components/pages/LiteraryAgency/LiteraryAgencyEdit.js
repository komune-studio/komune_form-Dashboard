import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LiteraryAgencies from "models/LiteraryAgenciesModel";
import LiteraryAgencyFormPage from "./LiteraryAgencyFormPage";

const LiteraryAgencyEdit = () => {
  const [agencyData, setAgencyData] = useState({})

  const params = useParams();

  const getAgencyData = async (id) => {
    return await LiteraryAgencies.getById(id);
  }

  useEffect(() => {
    (async () => {
      let result = await getAgencyData(params.id)
      setAgencyData(result)
    })()
  }, [params])


  return (
    <LiteraryAgencyFormPage agencyData={agencyData}></LiteraryAgencyFormPage>
  )
}

export default LiteraryAgencyEdit;