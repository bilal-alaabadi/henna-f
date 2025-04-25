import React from 'react';
import { FaInstagram, FaTwitter, FaFacebookF, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
          
          {/* قسم ABOUT */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-4">عن المتجر</h4>
            <ul className="space-y-2">
              <li>
                <a href={"/shop"} className="text-gray-600 hover:text-[#d3ae27]  transition-colors duration-300">المنتجات</a>
              </li>
            </ul>
          </div>
          
          {/* قسم LEGAL */}
          {/* <div>
            <h4 className="text-lg font-bold text-gray-800 mb-4">الشروط والأحكام</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition">سياسة الإرجاع</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary transition">شروط الخصوصية</a>
              </li>
            </ul>
          </div> */}
          
          {/* قسم SOCIAL */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-4">وسائل التواصل</h4>
            <div className="flex justify-center md:justify-end gap-4">
              <a href="https://www.instagram.com/henna.burgund/reels/" className="text-gray-600 hover:hover:text-[#d3ae27]  transition">
                <FaInstagram className="text-xl" />
              </a>
              <a href="https://api.whatsapp.com/send/?phone=96876704406&text&type=phone_number&app_absent=0" className="text-gray-600 hover:text-[#d3ae27]  transition">
                <FaWhatsapp className="text-xl" />
              </a>
            </div>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="border-t border-gray-200 mt-10 pt-5 text-center text-sm text-gray-600">
  <p className="leading-relaxed">
    تم التطوير بواسطة  
    <a
      href="https://www.instagram.com/roya_sow/"
      className="hover:text-[#d3ae27]  font-semibold hover:underline mx-1"
    >
      شركة رؤية
    </a>
    بجودة واحترافية
  </p>
</div>

      </div>
    </footer>
  );
};

export default Footer;
