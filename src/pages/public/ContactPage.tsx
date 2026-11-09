import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { SEO } from '../../components/common/SEO';
import { EnquiryForm } from '../../components/common/EnquiryForm';
import { isDialablePhone } from '../../utils/formatters';

export const ContactPage: React.FC = () => {
  const { settings } = useSiteSettings();
  const [searchParams] = useSearchParams();
  const preselectedClass = searchParams.get('class') || '';

  return (
    <>
      <SEO
        title="Contact & Studio Location in Lucknow"
        description="Visit Yog Drishti at 5/53 Vikas Khand, near Dayal Chauraha, Gomti Nagar, Lucknow. Submit an enquiry for batch timings and memberships."
        canonicalUrl="https://yogdrishti.org/contact"
      />

      <div className="py-16 md:py-24 bg-cream">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs uppercase font-semibold tracking-widest text-gold">Reach Us</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest mt-2 mb-4">
              Get in Touch
            </h1>
            <p className="text-sm sm:text-base text-charcoal/75">
              Have questions regarding our yoga classes, schedule, or studio visits? We are happy to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Contact Details & Map */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-sage/30 shadow-soft space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-forest mb-4">Studio Details</h2>
                  <div className="space-y-4 text-sm text-charcoal/80">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-forest shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-charcoal">Address:</strong>
                        <span>{settings.address}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-forest shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-charcoal">Phone:</strong>
                        {isDialablePhone(settings.phone_number) ? (
                          <a
                            href={`tel:${settings.phone_number}`}
                            className="text-forest hover:text-gold font-medium"
                          >
                            {settings.phone_number}
                          </a>
                        ) : (
                          <span>{settings.phone_number}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-forest shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-charcoal">Email:</strong>
                        <a
                          href={`mailto:${settings.email}`}
                          className="text-forest hover:text-gold"
                        >
                          {settings.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-forest shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-charcoal">Hours:</strong>
                        <span>{settings.opening_hours}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-sage/20">
                  <a
                    href={settings.google_maps_directions_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full text-center py-3 text-xs justify-center"
                  >
                    <span>Open in Google Maps</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Map Embed */}
              <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-sage/30 shadow-soft bg-white">
                <iframe
                  title="Yog Drishti Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14238.749718442885!2d80.9856191!3d26.8504068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be2c2446f2e8b%3A0xb15ad7e96b8e8f23!2sDayal%20Chauraha%2C%20Vikas%20Khand%2C%20Gomti%20Nagar%2C%20Lucknow%2C%20Uttar%20Pradesh%20226010!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Direct Enquiry Form */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-3xl border border-sage/30 shadow-luxury">
              <h2 className="font-serif text-3xl font-bold text-forest mb-2">Send an Enquiry</h2>
              <p className="text-xs text-charcoal/70 mb-8">
                Fill in your contact details below and our team will get in touch with you.
              </p>
              <EnquiryForm preselectedClass={preselectedClass} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};