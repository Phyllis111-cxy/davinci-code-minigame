import { Link } from 'react-router-dom'
import { Board } from '@/components/Board'
import { VnStage } from '@/components/VnStage'
import type { GameApi } from '@/game/useGame'
import { IMG } from '@/media/images'
import './Ending.css'

interface EndingProps {
  game: GameApi
}

export function Ending({ game }: EndingProps) {
  const { episode, reset, state } = game
  const teaser = episode.ending.sophieTeaser
  const purchase = episode.ending.purchase

  if (state.endingStep === 'epilogue') {
    return (
      <VnStage
        className="has-ending-epilogue"
        backgroundSrc={IMG.wall}
        line={state.langdonLine}
        hint={<span className="vn-hint-continue">点击屏幕继续</span>}
      >
        <Board game={game} interactive={false} fill />
      </VnStage>
    )
  }

  if (state.endingStep === 'epilogueOffice') {
    return (
      <VnStage
        backgroundSrc={IMG.office}
        showPortrait
        line={state.langdonLine}
        hint={<span className="vn-hint-continue">点击屏幕继续</span>}
      />
    )
  }

  return (
    <VnStage className="has-ending-cta" backgroundSrc={IMG.wall}>
      <Board game={game} interactive={false} fill />
      <div
        className="vn-ending-dock"
        onClick={(event) => event.stopPropagation()}
      >
        <Link className="teaser-card" to={teaser.route}>
          <strong>{teaser.title}</strong>
          <span>{teaser.blurb}</span>
          <em>{teaser.available ? '立即前往' : '敬请期待'}</em>
        </Link>
        {purchase.url && purchase.url !== 'TBD' ? (
          <a
            className="purchase-link"
            href={purchase.url}
            target="_blank"
            rel="noreferrer"
          >
            {purchase.label}
          </a>
        ) : (
          <p className="purchase-placeholder">
            {purchase.label} · {episode.ui.purchasePending}
          </p>
        )}
        <button type="button" className="ghost-btn" onClick={reset}>
          {episode.ui.playAgain}
        </button>
      </div>
    </VnStage>
  )
}
