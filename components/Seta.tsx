// Seta dos botões: anda um pouco na direção dela quando o botão está sob o mouse
// ou em foco. O botão precisa da classe "group".
const caminhos = {
  direita: "M4 12h15m-6-6 6 6-6 6",
  baixo: "M12 4v15m-6-6 6 6 6-6",
  fora: "M7 17 17 7M8 7h9v9",
};
const movimento = {
  direita: "group-hover:translate-x-1 group-focus-visible:translate-x-1",
  baixo: "group-hover:translate-y-0.5 group-focus-visible:translate-y-0.5",
  fora: "group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5",
};

export function Seta({ direcao = "direita" }: { direcao?: keyof typeof caminhos }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-[1.05em] w-[1.05em] shrink-0 transition-transform duration-300 ease-out ${movimento[direcao]}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={caminhos[direcao]} />
    </svg>
  );
}
