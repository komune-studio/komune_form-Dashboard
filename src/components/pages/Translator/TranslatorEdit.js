import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TranslatorFormPage from "./TranslatorFormPage"
import Translator from "models/TranslatorModel";

const TranslatorEdit = () => {
  const [translatorData, setTranslatorData] = useState({})

  const params = useParams();

  const getTranslatorData = async (id) => {
    return await Translator.getById(id);
  }

  useEffect(() => {
    (async () => {
      let result = await getTranslatorData(params.id)
      setTranslatorData(result)
    })()
  }, [params])

  return (
    <TranslatorFormPage translatorData={translatorData}></TranslatorFormPage>
  )
}

export default TranslatorEdit