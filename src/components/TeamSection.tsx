import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";

const team = [
  { name: "Harsh Trivedi", id: "2403031057137", role: "ML Engineer", initials: "HT", color: "bg-blue-100 text-medical-blue" },
  { name: "Mona Patel", id: "2403031057082", role: "Data Scientist", initials: "MP", color: "bg-teal-100 text-teal" },
  { name: "Harsh Kesarkar", id: "2403031057039", role: "Backend Developer", initials: "HK", color: "bg-indigo-100 text-indigo-600" },
  { name: "Vansh Kalariya", id: "2403031057035", role: "UI/UX Designer", initials: "VK", color: "bg-amber-100 text-amber-700" },
];

export default function TeamSection() {
  return (
    <section id="team" className="section-pad bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="badge-primary mb-4">Research Team</span>
          <h2 className="text-4xl font-bold text-foreground mb-4">Meet the Team</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Computer Science students specializing in machine learning and healthcare technology.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="clinical-card group cursor-default text-center"
            >
              {/* Avatar */}
              <div className={`w-16 h-16 ${member.color} rounded-2xl mx-auto mb-4 flex items-center justify-center text-xl font-bold`}>
                {member.initials}
              </div>

              {/* Name + Role */}
              <h3 className="font-bold text-foreground text-base mb-0.5">{member.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{member.role}</p>

              {/* ID badge */}
              <div className="inline-block px-3 py-1.5 bg-muted rounded-lg">
                <span className="text-xs font-mono font-medium text-muted-foreground tracking-wide">
                  {member.id}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Supervisor note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-block px-5 py-3 bg-accent rounded-xl">
            <p className="text-sm text-accent-foreground">
              <span className="font-semibold">Institution:</span> Computer Science Department · Academic Research Project 2026
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
