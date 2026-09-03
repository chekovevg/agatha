import type {ScorePhrase} from "@/content/score-phrases";
import {buildStaffPaths, placeNotes} from "@/lib/score-geometry";

export function CurvedScore({
  activeNoteIndex = -1,
  phrase,
}: {
  activeNoteIndex?: number;
  phrase: ScorePhrase;
}) {
  const staffPaths = buildStaffPaths(phrase.curve);
  const notes = placeNotes(phrase.curve, phrase.notes);

  return (
    <figure
      className="musical-score-stage"
      data-musical-score="true"
      data-score-shape={phrase.curve.id}
    >
      <svg
        aria-hidden="true"
        className="musical-score-svg"
        viewBox="0 0 1000 480"
        role="img"
      >
        <g className="score-staff">
          {staffPaths.map((path, index) => (
            <path key={index} d={path} />
          ))}
        </g>

        <text
          className="score-clef"
          x="89"
          y="286"
          transform="rotate(-48 89 286)"
        >
          𝄞
        </text>

        <g className="score-annotations">
          <path d="M 552 76 Q 618 122 692 82" />
          <path d="M 414 405 Q 486 356 558 404" />
          <text x="482" y="75">tr~~~~</text>
          <text x="745" y="367">p</text>
        </g>

        <g className="score-notes">
          {notes.map((point, index) => {
            const note = phrase.notes[index];
            const stemUp = note.staffOffset < 3;

            return (
              <g
                key={`${note.time}-${note.pitch}`}
                className="score-note"
                data-active={activeNoteIndex === index}
                data-note-index={index}
                transform={`translate(${point.x.toFixed(2)} ${point.y.toFixed(2)}) rotate(${point.angle.toFixed(2)})`}
              >
                <ellipse cx="0" cy="0" rx="5.8" ry="4.1" transform="rotate(-18)" />
                <line
                  x1={stemUp ? 5 : -5}
                  x2={stemUp ? 5 : -5}
                  y1="0"
                  y2={stemUp ? -28 : 28}
                />
                {index % 4 !== 3 ? (
                  <line
                    className="score-note-flag"
                    x1={stemUp ? 5 : -5}
                    x2={stemUp ? 14 : -14}
                    y1={stemUp ? -28 : 28}
                    y2={stemUp ? -24 : 24}
                  />
                ) : null}
              </g>
            );
          })}
        </g>
      </svg>

      <figcaption className="musical-score-caption">
        <span>{phrase.composer}</span>
        <cite>{phrase.work}</cite>
      </figcaption>
    </figure>
  );
}
