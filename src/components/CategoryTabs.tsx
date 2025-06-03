
const CategoryTabs = () => {
  const categories = [
    "Business",
    "Design", 
    "Marketing",
    "Photography & Video",
    "IT & Software"
  ];

  return (
    <section className="py-8 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-6 justify-center md:justify-start">
          {categories.map((category, index) => (
            <button
              key={category}
              className={`px-4 py-2 font-medium transition-colors ${
                index === 0 
                  ? 'text-purple-600 border-b-2 border-purple-600' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryTabs;
