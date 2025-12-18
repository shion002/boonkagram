import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";

export interface CountdownTimerHandles {
  reset: (newMinutes?: number) => void;
  start: () => void;
  pause: () => void;
}

interface Props {
  minutes?: number;
  autoStart?: boolean;
}

const CountdownTimer = forwardRef<CountdownTimerHandles, Props>(
  ({ minutes = 3, autoStart = true }, ref) => {
    const [remaining, setRemaining] = useState(minutes * 60);
    const intervalRef = useRef<number | null>(null);
    const endTimeRef = useRef<number | null>(null);
    const runningRef = useRef<boolean>(autoStart);

    const format = (sec: number) => {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    const start = () => {
      if (runningRef.current) return;
      runningRef.current = true;

      endTimeRef.current = Date.now() + remaining * 1000;
      tickStart();
    };

    const pause = () => {
      runningRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };

    const reset = (newMinutes = minutes) => {
      pause();
      const secs = newMinutes * 60;
      setRemaining(secs);
      endTimeRef.current = null;
      runningRef.current = false;
    };

    useImperativeHandle(ref, () => ({
      reset,
      start,
      pause,
    }));

    const tickStart = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);

      if (!endTimeRef.current) {
        endTimeRef.current = Date.now() + remaining * 1000;
      }

      const tick = () => {
        if (endTimeRef.current == null) return;

        const msLeft = endTimeRef.current - Date.now();
        const secLeft = Math.max(0, Math.ceil(msLeft / 1000));
        setRemaining(secLeft);

        if (secLeft <= 0) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          runningRef.current = false;
        }
      };

      tick();
      intervalRef.current = setInterval(tick, 250);
    };

    useEffect(() => {
      if (autoStart) {
        endTimeRef.current = Date.now() + remaining * 1000;
        tickStart();
      }
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div>
        <div style={{ fontSize: 16, padding: "8px 0px", fontFamily: "gothic" }}>
          {format(remaining)}
        </div>
      </div>
    );
  }
);

export default CountdownTimer;
