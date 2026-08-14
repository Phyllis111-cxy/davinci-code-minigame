import { VnStage } from '@/components/VnStage'
import type { GameApi } from '@/game/useGame'
import { IMG } from '@/media/images'
import './TitleScreen.css'

interface TitleScreenProps {
  game: GameApi
}

export function TitleScreen({ game }: TitleScreenProps) {
  const { episode, beginEpisode } = game
  const screen = episode.titleScreen

  return (
    <VnStage className="has-title-screen" backgroundSrc={IMG.office}>
      <div
        className="vn-title-dock"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="title-kicker">{screen.kicker}</p>
        <h1 className="title-headline">{screen.headline}</h1>
        <p className="title-setting">{screen.setting}</p>
        <p className="title-blurb">{screen.blurb}</p>
        <p className="title-duration">{screen.duration}</p>
        <button type="button" className="title-cta" onClick={beginEpisode}>
          {screen.cta}
        </button>
      </div>
    </VnStage>
  )
}
