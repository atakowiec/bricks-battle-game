import { IMap } from '@shared/Map.ts';

export const Base64 = (function() {
  const digitsStr = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+-';
  const digits = digitsStr.split('');
  const digitsMap: any = {};
  for (let i = 0; i < digits.length; i++) {
    digitsMap[digits[i]] = i;
  }
  return {
    fromInt: function(int32: number) {
      let result = '';
      while (true) {
        result = digits[int32 & 0x3f] + result;
        int32 >>>= 6;
        if (int32 === 0)
          break;
      }
      return result;
    },
    toInt: function(digitsStr: string) {
      let result = 0;
      const digits = digitsStr.split('');
      for (let i = 0; i < digits.length; i++) {
        result = (result << 6) + digitsMap[digits[i]];
      }
      return result;
    },
  };
})();

export function encodeMap(map: IMap) {
  const chunks: number[][] = [];
  for (let i = 0; i < map.data.length; i += map.size) {
    chunks.push(map.data.slice(i, i + map.size).split('').map(c => Base64.toInt(c)));
  }
  return chunks
}