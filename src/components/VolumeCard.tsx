interface VolumeCardProps {
  volume: number
  label: string
}

function VolumeCard({ volume, label }: VolumeCardProps) {
  const formatVolume = (value: number): string => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(2)}K`
    }
    return `$${value.toFixed(2)}`
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 text-sm font-medium">{label}</h3>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-bold text-white">
          {formatVolume(volume)}
        </span>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">完整数值</span>
          <span className="text-slate-300 font-mono text-xs">
            ${volume.toLocaleString('en-US')}
          </span>
        </div>
      </div>
    </div>
  )
}

export default VolumeCard
