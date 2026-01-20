interface PlaceholderProps {
  title: string
  description?: string
}

function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <div className="p-6 min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-wrench text-3xl text-blue-600"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
          {description && (
            <p className="text-gray-600 text-lg mb-8">{description}</p>
          )}
          <p className="text-gray-500">
            此页面正在开发中，敬请期待...
          </p>
        </div>
      </div>
    </div>
  )
}

export default Placeholder
