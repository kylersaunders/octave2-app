export default function Autoplay({ src }: { src: string }) {
  return (
    <audio controls autoPlay key={'audio-' + src}>
      <source src={src} type='audio/mpeg' key={'src-' + src} />
      Your browser does not support the audio element.
    </audio>
  );
}
