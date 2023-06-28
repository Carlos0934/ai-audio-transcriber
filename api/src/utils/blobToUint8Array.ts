function blobToUint8Array(input: Uint8Array): Promise<Blob> {
  const response = new Response(input);

  return response.blob();
}

export default blobToUint8Array;
