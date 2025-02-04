import JobCard from "./JobCard";

const jobs = [
  {
    id: 1,
    title: "Gaming UI Designer",
    company: "Rockstar Games",
    location: "ElMansoura, Egypt",
    posted: "10 days ago",
    experience: "0 - 3y of exp",
    type: "Full time",
    mode: "Remote",
    categories: ["Creative / Design", "IT / Software development", "Gaming"],
    highlighted: true,
  },
  {
    id: 2,
    title: "Senior UX UI Designer",
    company: "Egabi",
    location: "Cairo, Egypt",
    posted: "1 month ago",
    experience: "0 - 3y of exp",
    type: "Full time",
    mode: "Hybrid",
    categories: ["Creative / Design", "IT / Software development"],
  },
  {
    id: 3,
    title: "React Frontend Developer",
    company: "Magara",
    location: "Cairo, Egypt",
    posted: "1 month ago",
    experience: "5 - 7y of exp",
    type: "Freelance",
    mode: "Remote",
    categories: ["Creative / Design", "IT / Software development"],
  },
];

export default function JobList() {
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard key={job.id} {...job} />
      ))}
    </div>
  );
}
