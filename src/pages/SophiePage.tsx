import { Link } from 'react-router-dom'
import './SophiePage.css'

export function SophiePage() {
  return (
    <div className="sophie-page">
      <div className="sophie-card">
        <p className="sophie-kicker">第二集预告</p>
        <h1>索菲·奈芙</h1>
        <p>
          密码破译员即将带你读现场——墙外的线索，往往比墙上的更锋利。本集玩法尚未开放，敬请期待。
        </p>
        <Link className="primary-btn" to="/">
          返回兰登篇
        </Link>
      </div>
    </div>
  )
}
