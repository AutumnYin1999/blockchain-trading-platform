import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'

interface TopNavbarProps {
  onMenuToggle: () => void
}

function TopNavbar({ onMenuToggle }: TopNavbarProps) {
  const navigate = useNavigate()
  const { language, toggleLanguage, t } = useLanguage()

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 左侧：Logo和菜单按钮 */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-bars text-gray-600"></i>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">
                {language === 'zh' ? '区块链资产发行平台' : 'Blockchain Asset Platform'}
              </h1>
            </div>
          </div>

          {/* 右侧：返回总入口、语言切换 */}
          <div className="flex items-center space-x-3">
            {/* 返回总入口按钮 */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
              title={language === 'zh' ? '返回总入口' : 'Back to Home'}
            >
              <i className="fas fa-home"></i>
              <span className="font-medium text-sm">{language === 'zh' ? '返回总入口' : 'Back to Home'}</span>
            </button>

            {/* 语言切换按钮 */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title={t('common.language')}
            >
              <i className="fas fa-language"></i>
              <span className="font-medium text-sm">
                {language === 'zh' ? 'EN' : '中文'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default TopNavbar
