import { useCallback, useRef } from "react";

/**
 * 创建一个防抖的点击处理函数
 * @param callback 要执行的回调函数
 * @param delay 防抖延迟时间（毫秒）
 * @returns 防抖后的处理函数
 */
export function useDebounceCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number = 300,
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        callback(...args);
      }, delay);
    },
    [callback, delay],
  ) as T;
}

/**
 * 创建一个立即执行并防止重复点击的处理函数
 * @param callback 要执行的回调函数
 * @param cooldown 冷却时间（毫秒）
 * @returns 防重复点击的处理函数
 */
export function useClickLock<T extends (...args: unknown[]) => unknown>(
  callback: T,
  cooldown: number = 300,
): T {
  const isLockedRef = useRef(false);

  return useCallback(
    (...args: Parameters<T>) => {
      if (isLockedRef.current) {
        return;
      }

      isLockedRef.current = true;

      Promise.resolve(callback(...args)).finally(() => {
        setTimeout(() => {
          isLockedRef.current = false;
        }, cooldown);
      });
    },
    [callback, cooldown],
  ) as T;
}
