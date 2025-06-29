import React from "react";
import { motion } from "framer-motion";
import { LessonBlock as LessonBlockType } from "@/lib/academy/lessonSchema";

interface LessonBlockProps {
  block: LessonBlockType;
}

const LessonBlock: React.FC<LessonBlockProps> = ({ block }) => {
  return (
    <motion.div
      id={block.id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ width: "100%" }}
    >
      <Card >
        <CardHeader>
          <CardTitle style={{ fontSize: "1.875rem", fontWeight: "700" }}>
            {block.title}
          </CardTitle>
        </CardHeader>
        <CardContent style={{ marginTop: "32px" }}>
          <p >
            {block.content}
          </p>

          <div>
            <h4 style={{ marginBottom: "16px" }}>
              Key Takeaways
            </h4>
            <ul >
              {block.keyTakeaways.map((takeaway, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{ display: "flex" }}
                >
                  <span style={{fontSize: '16px'}}>✅</span>
                  <span >{takeaway}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LessonBlock; 