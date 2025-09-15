import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const getCardData = (sectionId: string, cardIndex: number) => {
  const cardContent = {
    about: [
      { icon: '🎯', title: 'Our Mission', description: 'Empowering businesses through innovation', content: 'We believe in creating solutions that make a real difference in how people work and interact with technology.' },
      { icon: '👥', title: 'Our Team', description: 'Passionate experts dedicated to excellence', content: 'A diverse group of professionals united by our commitment to delivering exceptional results for every client.' },
      { icon: '🌟', title: 'Our Values', description: 'Integrity, innovation, and impact', content: 'We operate with transparency, push boundaries with creative solutions, and measure success by the positive impact we create.' }
    ],
    services: [
      { icon: '🚀', title: 'Web Development', description: 'Modern, responsive web applications', content: 'Custom web solutions built with the latest technologies to deliver exceptional user experiences and robust functionality.' },
      { icon: '📱', title: 'Mobile Apps', description: 'Native and cross-platform solutions', content: 'Mobile applications that engage users and drive business growth across iOS and Android platforms.' },
      { icon: '🎨', title: 'UI/UX Design', description: 'User-centered design approach', content: 'Beautiful, intuitive interfaces designed with your users in mind, ensuring optimal usability and engagement.' }
    ],
    portfolio: [
      { icon: '💼', title: 'Enterprise Solutions', description: 'Large-scale business applications', content: 'Complex enterprise systems that streamline operations and improve efficiency for major corporations.' },
      { icon: '🛍️', title: 'E-commerce Platforms', description: 'Online retail experiences', content: 'Full-featured e-commerce solutions that drive sales and provide seamless shopping experiences.' },
      { icon: '📊', title: 'Data Dashboards', description: 'Analytics and reporting tools', content: 'Interactive dashboards that transform complex data into actionable insights for better decision-making.' }
    ],
    testimonials: [
      { icon: '⭐', title: 'Client Satisfaction', description: '98% client satisfaction rate', content: '"Working with this team has been transformative for our business. They delivered beyond our expectations and continue to provide excellent support."' },
      { icon: '🏆', title: 'Award Winner', description: 'Recognized for excellence', content: '"The innovative approach and attention to detail resulted in a solution that not only met our needs but exceeded industry standards."' },
      { icon: '🤝', title: 'Long-term Partnership', description: 'Building lasting relationships', content: '"What started as a single project has grown into a strategic partnership. Their expertise and reliability are unmatched."' }
    ],
    blog: [
      { icon: '📝', title: 'Industry Insights', description: 'Latest trends and developments', content: 'Stay ahead of the curve with our analysis of emerging technologies and their impact on business strategies.' },
      { icon: '💡', title: 'Best Practices', description: 'Tips and methodologies', content: 'Practical advice and proven methodologies to help you implement successful digital transformation initiatives.' },
      { icon: '🔬', title: 'Case Studies', description: 'Real-world success stories', content: 'Detailed breakdowns of how we\'ve helped clients overcome challenges and achieve their business objectives.' }
    ],
    contact: [
      { icon: '📧', title: 'Email Us', description: 'hello@company.com', content: 'Send us a message and we\'ll get back to you within 24 hours. We\'re here to answer any questions you might have.' },
      { icon: '📞', title: 'Call Us', description: '+1 (555) 123-4567', content: 'Speak directly with our team. We\'re available Monday through Friday, 9 AM to 6 PM EST.' },
      { icon: '📍', title: 'Visit Us', description: '123 Business Street, City', content: 'Drop by our office for a face-to-face conversation. We love meeting clients and partners in person.' }
    ]
  };

  return cardContent[sectionId as keyof typeof cardContent]?.[cardIndex] || {
    icon: '🔧',
    title: `Feature ${cardIndex + 1}`,
    description: 'Default feature description',
    content: 'This is default content for the card.'
  };
};

export function DemoContent() {
  const sections = [
    {
      id: 'home',
      title: 'Welcome Home',
      description: 'Experience the power of interactive navigation',
      className: 'bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground',
      height: 'min-h-screen'
    },
    {
      id: 'about',
      title: 'About Us',
      description: 'Discover our story and mission',
      className: 'bg-secondary',
      height: 'min-h-[100vh]'
    },
    {
      id: 'services',
      title: 'Our Services',
      description: 'Comprehensive solutions for your needs',
      className: 'bg-gradient-to-br from-accent to-accent/80',
      height: 'min-h-[100vh]'
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      description: 'Showcasing our finest work',
      className: 'bg-muted',
      height: 'min-h-[100vh]'
    },
    {
      id: 'testimonials',
      title: 'Testimonials',
      description: 'What our clients say about us',
      className: 'bg-gradient-to-br from-primary/20 to-primary/10',
      height: 'min-h-[100vh]'
    },
    {
      id: 'blog',
      title: 'Blog & Insights',
      description: 'Latest thoughts and industry updates',
      className: 'bg-secondary/50',
      height: 'min-h-[100vh]'
    },
    {
      id: 'contact',
      title: 'Contact Us',
      description: 'Let\'s start a conversation',
      className: 'bg-gradient-to-br from-primary/30 to-primary/20',
      height: 'min-h-[100vh]'
    }
  ];

  return (
    <div>
      {sections.map((section, index) => (
        <section 
          key={section.id}
          id={section.id}
          className={`${section.className} ${section.height} flex items-center justify-center`}
        >
          <div className="container mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl mb-6">{section.title}</h1>
              <p className="text-lg md:text-xl mb-8 opacity-90">{section.description}</p>
              
              {index === 0 && (
                <div className="space-y-8">
                  <p className="text-base opacity-80 max-w-2xl mx-auto">
                    Scroll down to see the advanced navigation features: active section highlighting, 
                    smooth scrolling, mobile menu, progress indicator, and dynamic styling transformations.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button className="bg-white text-primary px-8 py-3 rounded-lg hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-lg">
                      Explore Features
                    </button>
                    <button className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-105">
                      Learn More
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
                    {[
                      { icon: '🎯', title: 'Active Tracking', desc: 'Highlights current section' },
                      { icon: '📱', title: 'Mobile Ready', desc: 'Responsive hamburger menu' },
                      { icon: '⚡', title: 'Smooth Scrolling', desc: 'Animated section transitions' }
                    ].map((feature, i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-all duration-300">
                        <div className="text-3xl mb-3">{feature.icon}</div>
                        <h3 className="font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm opacity-80">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {index > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">
                  {Array.from({ length: 3 }).map((_, cardIndex) => {
                    const cardData = getCardData(section.id, cardIndex);
                    return (
                      <Card 
                        key={cardIndex} 
                        className="hover:shadow-xl transition-all duration-500 hover:scale-105 border-0 shadow-lg"
                      >
                        <CardHeader className="pb-3">
                          <div className="text-3xl mb-3">{cardData.icon}</div>
                          <CardTitle className="text-lg">{cardData.title}</CardTitle>
                          <CardDescription className="text-sm">
                            {cardData.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm opacity-80 mb-4">
                            {cardData.content}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">
                              {section.title} • Item {cardIndex + 1}
                            </span>
                            <button className="text-xs text-primary hover:text-primary/80 transition-colors">
                              Learn More →
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}