import { motion } from "framer-motion";
import { Mail, Phone, Github } from "lucide-react";

export default function Contact() {
  const items = [
    {
      label: "Email",
      value: "yasir@example.com",
      link: "mailto:yasir@example.com",
      icon: <Mail size={24} />,
    },
    {
      label: "Phone",
      value: "+92 300 1234567",
      link: "tel:+923001234567",
      icon: <Phone size={24} />,
    },
    {
      label: "GitHub",
      value: "github.com/yasirsultan",
      link: "https://github.com/yasirsultan",
      icon: <Github size={24} />,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <h2 className="text-4xl font-bold mb-8">Contact Me</h2>

      <div className="space-y-6 w-full max-w-md">
        {items.map((item, index) => (
          <motion.a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, x: 10 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-between p-5 rounded-2xl shadow-lg border cursor-pointer hover:bg-gray-100 transition"
          >
            <div className="flex items-center space-x-4">
              <span className="text-blue-600">{item.icon}</span>
              <div>
                <p className="font-semibold">{item.label}</p>
                <p className="text-sm text-gray-600">{item.value}</p>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
