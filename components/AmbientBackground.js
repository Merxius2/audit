/**
 * AmbientBackground
 * Fixed-position mesh-gradient blobs that sit behind all content.
 * Liquid-glass surfaces above pick up tint from this layer through backdrop-filter.
 * Rendered once at the app root.
 */
export default function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed -inset-x-[20vw] -inset-y-[20vh] -z-10 overflow-hidden">
      <div
        className="absolute rounded-full"
        style={{
          width: '60vw', height: '60vw', left: '-8vw', top: '-10vh',
          background: 'radial-gradient(circle, #B8C4FF 0%, transparent 65%)',
          filter: 'blur(80px)', opacity: 0.85,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '50vw', height: '50vw', right: '-10vw', top: '8vh',
          background: 'radial-gradient(circle, #FFC6BC 0%, transparent 65%)',
          filter: 'blur(80px)', opacity: 0.70,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '70vw', height: '70vw', left: '5vw', bottom: '-25vh',
          background: 'radial-gradient(circle, #C8F0DB 0%, transparent 65%)',
          filter: 'blur(80px)', opacity: 0.80,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '35vw', height: '35vw', right: '10vw', bottom: '5vh',
          background: 'radial-gradient(circle, #E4D6FF 0%, transparent 65%)',
          filter: 'blur(80px)', opacity: 0.70,
        }}
      />
    </div>
  );
}
