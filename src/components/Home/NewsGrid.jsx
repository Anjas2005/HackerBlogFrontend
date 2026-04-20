import {
    categoryColors,
    categoryGradients,
} from "../../data/colorData";
import { categoryIcons } from "../../data/data";
import NewsCard from "../ui/NewsCard";

const NewsGrid = ({
    data
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((story, index) => {
        const CategoryIcon = categoryIcons[story.category] || categoryIcons.default;
        const styleClass = categoryColors[story.category] || categoryColors.default;
        const gradientClass = categoryGradients[story.category] || categoryGradients.default;

        return (
          <NewsCard 
            key={index}
            CategoryIcon={CategoryIcon}
            styleClass={styleClass}
            gradientClass={gradientClass}
            story={story}
            index={index}
          />
        );
      })}
    </div>
  )
}

export default NewsGrid
