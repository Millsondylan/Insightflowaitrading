import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { LessonBlock as LessonBlockType } from "@/lib/academy/lessonSchema";

interface LessonBlockProps {
  block: LessonBlockType;
}

const LessonBlock: React.FC<Lessonblockprops > = ({ block }) => {
  return (
    <motion.div
      id={block.id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full mb-12"
    >
      <Card  />
        <Cardheader  >
          <Cardtitle  style={{ fontWeight: "700" }}>
            {block.title}
          </Cardtitle>
        </Cardheader>
        <Cardcontent  >
          <p className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
            {block.content}
          </p>

          <div>
            <h4 className="font-semibold text-xl mb-4 text-gray-200">
              Key Takeaways
            </h4>
            <ul className="space-y-3">
              {block.keyTakeaways.map((takeaway, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <checkcircle2  >
                  <span className="text-gray-300 text-base">{takeaway}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </Cardcontent>
      </Card>
    </motion.div>
  );
};

export default LessonBlock; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
