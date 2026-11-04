import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import SignalFallback from "./SignalFallback";
import type { Copy } from "../content/i18n";
const Scene = lazy(() => import("./SignalScene"));
class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? <SignalFallback /> : this.props.children;
  }
}
export default function SignalArtwork({ copy }: { copy: Copy }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    if (wrapper.current) observer.observe(wrapper.current);
    const visibility = () => setTabVisible(!document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => {
      media.removeEventListener("change", sync);
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  const staticMode = reduced || failed;
  return (
    <div className="artwork" ref={wrapper}>
      <div className="artwork-grid" aria-hidden="true" />
      <div className="artwork-canvas" aria-hidden="true">
        {staticMode ? (
          <SignalFallback />
        ) : (
          <SceneBoundary onFailure={() => setFailed(true)}>
            <Suspense fallback={<SignalFallback />}>
              <Scene
                active={visible && tabVisible && !paused}
                onFailure={() => setFailed(true)}
              />
            </Suspense>
          </SceneBoundary>
        )}
      </div>
      <div className="artwork-top">
        <span>{copy.study}</span>
        <span className="cross">+</span>
      </div>
      <div className="artwork-bottom">
        <span>{staticMode ? copy.staticStudy : copy.move}</span>
        {!staticMode && (
          <button
            aria-label={paused ? copy.resume : copy.pause}
            aria-pressed={paused}
            onClick={() => setPaused((v) => !v)}
          >
            {paused ? `▶ ${copy.resumeShort}` : `Ⅱ ${copy.pauseShort}`}
          </button>
        )}
      </div>
      <span className="artwork-coordinate" aria-hidden="true">
        S / O — 001
      </span>
    </div>
  );
}
