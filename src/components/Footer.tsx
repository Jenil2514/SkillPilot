
const Footer = () => {
  const skillSections = [
    {
      title: "Explore top skills and certifications",
      categories: [
        {
          title: "In-demand Careers",
          skills: ["Data Scientist", "Full Stack Web Developer", "Cloud Engineer", "Project Manager", "Game Developer", "See all Career Accelerators"]
        },
        {
          title: "Web Development", 
          skills: ["Web Development", "JavaScript", "React JS", "Angular", "Java"]
        },
        {
          title: "IT Certifications",
          skills: ["Amazon AWS", "AWS Certified Cloud Practitioner", "PX-900: Microsoft Azure Fundamentals", "AWS Certified Solutions Architect - Associate", "Kubernetes"]
        },
        {
          title: "Leadership",
          skills: ["Leadership", "Management Skills", "Project Management", "Personal Productivity", "Emotional Intelligence"]
        }
      ]
    },
    {
      title: "",
      categories: [
        {
          title: "Certifications by Skill",
          skills: ["Cybersecurity Certification", "IT Risk Management Certification", "Cloud Certification", "Data Analytics Certification", "HR Management Certification", "See all Certifications"]
        },
        {
          title: "Data Science",
          skills: ["Data Science", "Python", "Machine Learning", "ChatGPT", "Deep Learning"]
        },
        {
          title: "Communication",
          skills: ["Communication Skills", "Presentation Skills", "Public Speaking", "Writing", "PowerPoint"]
        },
        {
          title: "Business Analytics & Intelligence",
          skills: ["Microsoft Excel", "SQL", "Microsoft Power BI", "Data Analysis", "Business Analysis"]
        }
      ]
    }
  ];

  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        {skillSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-16">
            {section.title && (
              <h3 className="text-xl font-bold mb-8">{section.title}</h3>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {section.categories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h4 className="font-bold text-white mb-4">{category.title}</h4>
                  <ul className="space-y-2">
                    {category.skills.map((skill, skillIndex) => (
                      <li key={skillIndex}>
                        <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                          {skill}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 EduLearn, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
