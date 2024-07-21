"use server"
import { db } from '@/db'


export type SaveConfigArgs = {
  configId: string
  colorId: string
  finishId: string
  materialId: string
  modelId: string
}

export async function saveConfig({
  configId,
  colorId,
  finishId,
  materialId,
  modelId,
}: SaveConfigArgs) {
  await db.configuration.update({
    where: { id: configId },
    data: {
      caseColorId: colorId,
      caseFinishId: finishId,
      caseMaterialId: materialId,
      phoneModelId: modelId,
    },
  })
}