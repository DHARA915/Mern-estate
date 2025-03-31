import React from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaUsers, FaHandshake, FaAward, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaBuilding, FaChartLine, FaLeaf, FaLock, FaTools, FaLightbulb } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1 }
};

const About = () => {
  return (
    <section className="bg-[rgb(241,245 , 241);] text-slate-800 py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header with moving text */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
          className="text-center mb-16 px-4"
        >
          <motion.h2 
            className="text-4xl sm:text-5xl font-extrabold tracking-tight"
            variants={item}
          >
            Discover Your &nbsp;
            <motion.span
              animate={{ x: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent inline-block"
            >
              Dream Home
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl text-slate-600 mt-6 max-w-3xl mx-auto leading-relaxed"
            variants={item}
          >
            At <span className="bg-gradient-to-r from-slate-700 to-black bg-clip-text text-transparent font-semibold">EternaHomes</span>, we blend <span className="font-medium text-slate-700">innovation</span>, 
            <span className="font-medium text-slate-700"> expertise</span>, and <span className="font-medium text-slate-800">technology</span> to create seamless real estate experiences.
          </motion.p>
        </motion.div>

        {/* Vision and Mission Section */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 px-4"
        >
          {[
            { 
              title: 'Our Vision', 
              desc: 'Innovating real estate with sustainable and client-focused solutions that stand the test of time.', 
              gradient: 'bg-gradient-to-br from-slate-50 via-white to-slate-50',
              icon: <FaLightbulb className="text-4xl sm:text-5xl text-slate-700 mb-4" />,
              border: 'border border-slate-200/80'
            },
            { 
              title: 'Our Mission', 
              desc: 'Building trust through cutting-edge technology, transparency, and exceptional service.', 
              gradient: 'bg-gradient-to-br from-white via-slate-50 to-white',
              icon: <FaChartLine className="text-4xl sm:text-5xl text-slate-700 mb-4" />,
              border: 'border border-slate-200/80'
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
              transition={{ duration: 0.3 }}
              className={`p-8 sm:p-10 rounded-xl ${item.gradient} ${item.border} transition-all flex flex-col items-center text-center`}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                {item.icon}
              </motion.div>
              <motion.h3 
                className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {item.title}
              </motion.h3>
              <motion.p 
                className="text-base sm:text-lg leading-relaxed text-slate-700"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {item.desc}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>

        {/* Core Values Section */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-20 px-4"
        >
          <motion.h3 
            className="text-4xl sm:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-slate-700 to-black bg-clip-text text-transparent"
            variants={item}
          >
            Our Core Values
          </motion.h3>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            variants={container}
          >
            {[
              { 
                icon: <FaLeaf className="text-4xl sm:text-5xl text-slate-700" />,
                title: 'Sustainability',
                desc: 'Commitment to eco-friendly practices and green building solutions',
                gradient: 'from-slate-50 to-white'
              },
              { 
                icon: <FaLock className="text-4xl sm:text-5xl text-slate-700" />,
                title: 'Integrity',
                desc: 'Honest, transparent dealings in every transaction',
                gradient: 'from-white to-slate-50'
              },
              { 
                icon: <FaTools className="text-4xl sm:text-5xl text-slate-700" />,
                title: 'Innovation',
                desc: 'Leveraging technology to enhance real estate experiences',
                gradient: 'from-slate-50 to-white'
              },
              { 
                icon: <FaUsers className="text-4xl sm:text-5xl text-slate-700" />,
                title: 'Community',
                desc: 'Building neighborhoods, not just houses',
                gradient: 'from-white to-slate-50'
              },
              { 
                icon: <FaAward className="text-4xl sm:text-5xl text-slate-700" />,
                title: 'Excellence',
                desc: 'Uncompromising quality in every project',
                gradient: 'from-slate-50 to-white'
              },
              { 
                icon: <FaHandshake className="text-4xl sm:text-5xl text-slate-700" />,
                title: 'Partnership',
                desc: 'Collaborative approach with clients and partners',
                gradient: 'from-white to-slate-50'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.3 }}
                className={`bg-gradient-to-b ${item.gradient} p-6 sm:p-8 rounded-lg border border-slate-200/80 transition-all text-center flex flex-col items-center`}
              >
                <motion.div
                  initial={{ rotate: -10, scale: 0.8 }}
                  whileInView={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="mb-4"
                >
                  {item.icon}
                </motion.div>
                <motion.h4 
                  className="text-xl sm:text-2xl font-semibold mb-3 text-slate-800"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {item.title}
                </motion.h4>
                <motion.p 
                  className="text-slate-600 text-sm sm:text-base"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {item.desc}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Customer Reviews */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-20 px-4"
        >
          <motion.h3 
            className="text-4xl sm:text-5xl font-bold text-center mb-10 bg-gradient-to-r from-slate-700 to-black bg-clip-text text-transparent"
            variants={item}
          >
            What Our Clients Say
          </motion.h3>
          <motion.div variants={fadeIn} className="px-2 sm:px-0">
            <Swiper
              modules={[Pagination, Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              navigation
              pagination={{ clickable: true }}
              className="pb-12"
            >
              {[
                { name: 'Jessica M.', review: 'EternaHomes made my property search stress-free. Amazing service!' },
                { name: 'Michael R.', review: 'Top-notch real estate experts. Highly professional.' },
                { name: 'Emma W.', review: 'Their expertise helped me find my dream home easily. Highly recommend!' },
                { name: 'Liam T.', review: 'Excellent service! Smooth process and reliable assistance.' },
                { name: 'Sophia K.', review: 'Friendly and professional team. Made my home buying experience enjoyable.' },
                { name: 'David L.', review: 'Very responsive and transparent. Would definitely use again!' },
                { name: 'Olivia N.', review: 'Fantastic support throughout the buying process. Thank you!' },
                { name: 'James C.', review: 'Reliable and efficient. They exceeded my expectations.' },
                { name: 'Amelia F.', review: 'Courteous staff with great market knowledge. Seamless experience!' },
                { name: 'Ethan B.', review: 'Highly satisfied with their service. Strongly recommended!' }
              ].map((review, index) => (
                <SwiperSlide key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-slate-50 to-white shadow-md p-8 rounded-xl max-w-3xl mx-auto text-center border border-slate-200/80"
                  >
                    <motion.p 
                      className="text-base sm:text-lg text-slate-700 italic"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      "{review.review}"
                    </motion.p>
                    <motion.h4 
                      className="mt-6 text-slate-800 font-semibold"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      - {review.name}
                    </motion.h4>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </motion.div>

        {/* Team Section */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-20 px-4"
        >
          <motion.h3 
            className="text-4xl sm:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-slate-700 to-black bg-clip-text text-transparent"
            variants={item}
          >
            Meet Our Team
          </motion.h3>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={container}
          >
            {[
              { 
                name: 'Sarah Johnson', 
                role: 'Founder & CEO', 
                bio: '20+ years in real estate development and investment strategies',
                gradient: 'from-slate-100 to-white'
              },
              { 
                name: 'Michael Chen', 
                role: 'Head of Operations', 
                bio: 'Specializes in property management and client relations',
                gradient: 'from-white to-slate-100'
              },
              { 
                name: 'Emily Rodriguez', 
                role: 'Lead Architect', 
                bio: 'Designing sustainable living spaces for modern families',
                gradient: 'from-slate-100 to-white'
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -8, boxShadow: '0 15px 30px -5px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.3 }}
                className={`bg-gradient-to-b ${member.gradient} p-6 sm:p-8 rounded-xl shadow-sm text-center border border-slate-200/80`}
              >
                <motion.div 
                  className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl sm:text-4xl font-bold text-slate-700"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  {member.name.split(' ').map(n => n[0]).join('')}
                </motion.div>
                <motion.h4 
                  className="text-xl sm:text-2xl font-bold text-slate-800"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {member.name}
                </motion.h4>
                <motion.p 
                  className="text-slate-600 font-medium mb-4 text-sm sm:text-base"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {member.role}
                </motion.p>
                <motion.p 
                  className="text-slate-700 text-sm sm:text-base"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {member.bio}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Get in Touch Section */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-br from-slate-50 to-white p-8 sm:p-12 md:p-16 rounded-xl mx-4 text-center shadow-sm border border-slate-200/80"
        >
          <motion.h3 
            className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-700 to-black bg-clip-text text-transparent"
            variants={item}
          >
            Get in Touch
          </motion.h3>
          <motion.p 
            className="text-base sm:text-lg text-slate-600 mt-4 max-w-2xl mx-auto"
            variants={item}
          >
            Have questions? Our experts are ready to assist you with all your real estate needs.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 md:gap-12 mt-8 flex-wrap"
            variants={container}
          >
            {[
              {
                icon: <FaPhoneAlt className="text-xl sm:text-2xl text-slate-700" />,
                text: '+1 234 567 890',
                subtext: 'Mon-Fri, 9am-6pm'
              },
              {
                icon: <FaEnvelope className="text-xl sm:text-2xl text-slate-700" />,
                text: 'contact@eternahomes.com',
                subtext: 'Response within 24 hours'
              },
              {
                icon: <FaMapMarkerAlt className="text-xl sm:text-2xl text-slate-700" />,
                text: '123 Main St, Cityville',
                subtext: 'Visit our headquarters'
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={item}
                className="flex flex-col items-center gap-2 min-w-[200px]"
              >
                <motion.div 
                  className="flex items-center gap-3 sm:gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div 
                    className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-slate-200 to-white shadow-sm"
                    whileHover={{ scale: 1.1 }}
                  >
                    {item.icon}
                  </motion.div>
                  <p className="text-base sm:text-lg font-medium text-slate-800">{item.text}</p>
                </motion.div>
                <motion.p 
                  className="text-xs sm:text-sm text-slate-500"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.1 }}
                >
                  {item.subtext}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>

          <motion.button 
            whileHover={{ scale: 1.03, backgroundColor: "#1e293b" }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 px-8 py-3 sm:px-10 sm:py-4 bg-gradient-to-r from-slate-700 to-slate-800 text-white font-semibold rounded-lg hover:shadow-md transition-all shadow-sm text-sm sm:text-base"
          >
            Contact Us
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default About;