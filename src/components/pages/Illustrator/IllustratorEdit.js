import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IllustratorFormPage from "./IllustratorFormPage";
import Illustrator from "models/IllustratorModel";

const IllustratorEdit = () => {
  const [illustratorData, setillustratorData] = useState({})

  const params = useParams();

  const getIllustratorData = async (id) => {
    return await Illustrator.getById(id);
  }

  useEffect(() => {
    (async () => {
      let result = await getIllustratorData(params.id)
      setillustratorData(result)
    })()
  }, [params])


  return (
    <IllustratorFormPage illustratorData={illustratorData}></IllustratorFormPage>
  )
}

export default IllustratorEdit;