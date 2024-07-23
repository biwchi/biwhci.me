import dayjs from "dayjs";
import Paragraph from "./Paragraph";

type WorkCardProps = {
  location?: string;
  company: string;
  position: string;
  started: string;
  ended?: string;
  description: string[];
  skills: string[];
};

export default function WorkCards(props: { cards: WorkCardProps[] }) {
  const { cards } = props;

  return (
    <ul className="space-y-8 pt-2 mb-4">
      {cards.map((card, idx) => (
        <WorkCard key={idx} {...card} />
      ))}
    </ul>
  );
}

function WorkCard(props: WorkCardProps) {
  const { location, company, position, started, ended, description, skills } =
    props;

  return (
    <section className="rounded-md">
      <div className="flex flex-col sm:flex-row justify-between">
        <span>{location}</span>
        <DatePeriod started={started} ended={ended} />
      </div>

      <div className="flex gap-1 mt-2 xs:mt-1 flex-wrap whitespace-nowrap font-semibold">
        <h3 className="font-semibold">{position}</h3>
        <span className="text-text-80">at</span>
        <h3 className="font-semibold">{company}</h3>
      </div>

      <div className="my-3">
        {description.map((paragraph, idx) => (
          <Paragraph key={idx}>{paragraph}</Paragraph>
        ))}
      </div>

      <ul className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <li key={skill}>
            <SkillChip label={skill} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function SkillChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border-2 border-text-80 py-1 px-2 text-xs">
      {label}
    </span>
  );
}

function DatePeriod(props: { started: string; ended?: string }) {
  const format = "MMM YYYY";

  const start = dayjs(props.started).format(format);
  const end = props.ended ? dayjs(props.ended).format(format) : "Present";
  return (
    <span>
      {start} - {end}
    </span>
  );
}
