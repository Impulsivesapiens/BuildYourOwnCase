import { db } from '@/db'
import { notFound } from 'next/navigation'
import DesignPreview from './DesignPreview'

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const Page = async ({ searchParams }: PageProps) => {
  const { id } = searchParams

  if (!id || typeof id !== 'string') {
    return notFound()
  }

  const configuration = await db.configuration.findUnique({
    where: { id },
  })

  if (!configuration) {
    return notFound()
  }

  if (!configuration.caseColorId || !configuration.caseFinishId || !configuration.caseMaterialId || !configuration.phoneModelId) {
    return notFound()
  } else {
    const color = await db.caseColor.findUnique({
      where: { id: configuration.caseColorId },
    })
    const finish = await db.caseFinish.findUnique({
      where: { id: configuration.caseFinishId },
    })
    const material = await db.caseMaterial.findUnique({
      where: { id: configuration.caseMaterialId },
    })
    const model = await db.phoneModel.findUnique({
      where: { id: configuration.phoneModelId },
    })
    return <DesignPreview configuration={{ id: configuration.id, color: color || null, finish, material, model, croppedImageUrl: configuration.croppedImageUrl }} />
  }

}

export default Page
