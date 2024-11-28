// 计算单个文档的token
export const calculateTokensForDocument = (
  docType: string,
  params: {
    length?: number,
    imageCount?: number,
    imageSize?: number,
    duration?: number,
    complexity?: number
  },
  multipliers: Record<string, number>
) => {
  const {
    length = 0,
    imageCount = 0,
    imageSize = 1,
    duration = 0,
    complexity = 1
  } = params

  switch (docType) {
    case 'image':
      return imageSize * multipliers.image

    case 'audio':
      return duration * multipliers.audio

    case 'video':
      return duration * multipliers.video

    case 'excel':
    case 'ppt':
    case 'pdf':
      return (length * multipliers[docType] * complexity) +
             (imageCount * imageSize * multipliers.image)

    default:
      return length * multipliers[docType] * complexity
  }
} 