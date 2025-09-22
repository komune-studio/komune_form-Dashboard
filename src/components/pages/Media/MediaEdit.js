import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MediaFormPage from "./MediaFormPage"
import Media from "models/MediaModel";

const MediaEdit = () => {
  const [mediaData, setMediaData] = useState({})

  const params = useParams();

  const getMediaData = async (id) => {
    return await Media.getById(id);
  }

  useEffect(() => {
    (async () => {
      let result = await getMediaData(params.id)
      console.log(result);
      setMediaData(result)
    })()
  }, [params])


  return (
    <MediaFormPage mediaData={mediaData}></MediaFormPage>
  )
}

export default MediaEdit;