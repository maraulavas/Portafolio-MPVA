// Texto con la inicial de cada palabra en la cursiva Parfumerie Script.
export default function ScriptInitials({ text, scale = 1.5 }: { text: string; scale?: number }) {
  return (
    <span>
      {text.split(' ').map((w, i) => (
        <span key={i}>
          {i > 0 && ' '}
          <span style={{ fontFamily: "'Parfumerie Script', serif", fontSize: `${scale}em`, lineHeight: 0 }}>{w[0]}</span>
          {w.slice(1)}
        </span>
      ))}
    </span>
  )
}
