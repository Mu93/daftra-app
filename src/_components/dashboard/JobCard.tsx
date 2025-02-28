import { FC } from "react";
import { Heart, MapPin, Calendar } from "lucide-react";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  posted: string;
  experience: string;
  type: string;
  mode: string;
  categories: string[];
  highlighted?: boolean;
}

const JobCard: FC<JobCardProps> = ({
  title,
  company,
  location,
  posted,
  experience,
  type,
  mode,
  categories,
  highlighted = false,
}) => {
  return (
    <div
      className={`border rounded-xl p-5 shadow-sm ${
        highlighted ? "bg-green-50 border-green-200" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-green-600 font-medium">{company}</p>
        </div>
        <button>
          <Heart className="text-gray-400" size={20} />
        </button>
      </div>

      <div className="flex items-center text-gray-500 text-sm space-x-3 mt-2">
        <span className="flex items-center gap-1">
          <MapPin size={14} /> {location}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={14} /> {posted}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
          {experience}
        </span>
        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
          {type}
        </span>
        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
          {mode}
        </span>
      </div>

      <div className="text-gray-500 text-xs mt-3">{categories.join(" - ")}</div>
    </div>
  );
};

export default JobCard;
