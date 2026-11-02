function KlipseLoadLib(url, symbol) {
  if (window[symbol]) {
    return;
  }
  var script = document.createElement('script');
  script.src = url;
  document.body.append(script);
}
