async function importNativeFederation() {
  return new Function('specifier', 'return import(specifier)')(
    '@angular-architects/native-federation',
  );
}

(async () => {
  try {
    const federation = await importNativeFederation();
    await federation.initFederation();
  } catch (error) {
    console.warn(
      'Native Federation no pudo inicializarse en rooms-remote; se inicia standalone.',
      error,
    );
  }

  await import('./bootstrap');
})();
