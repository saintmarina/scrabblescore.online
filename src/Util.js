import React from 'react';

export default function resizeArray(array, desiredLength, defaultValue) {
  let output = array.slice(0, desiredLength);
  while (output.length < desiredLength)
    output.push(defaultValue);
  return output;
}