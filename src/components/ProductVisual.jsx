import { useState } from 'react'
import SneakerArt from './SneakerArt'
import ProductImage from './ProductImage'

/** Real product photos can be added per colorway without changing the cards. */
export default function ProductVisual({ product, colorway, className = '', loading = 'lazy' }) {
  const [failedPhoto, setFailedPhoto] = useState(null)
  const photo = colorway.photo || product.photo
  if (photo && failedPhoto !== photo) {
    return <ProductImage className={className} src={photo} alt={`${product.name}, ${colorway.name}`} loading={loading} onError={() => setFailedPhoto(photo)} />
  }
  return <SneakerArt className={className} colorway={colorway} title={`Ilustración de referencia: ${product.name}, ${colorway.name}`} />
}
