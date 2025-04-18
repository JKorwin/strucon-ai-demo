import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4 flex justify-between">
        <div>
          <h3 className="font-bold text-xl">Contact</h3>
          <p>Email: <a href="mailto:partners@strucon.ai" className="hover:text-indigo-500">partners@strucon.ai</a></p>
          <p>Phone: (941) 306-7691</p>
          <p>Socials: <a href="https://instagram.com/strucon.ai" target="_blank" className="hover:text-indigo-500"> @strucon.ai</a></p>
        </div>

       
        <div>
          <h3 className="font-bold text-xl">Quick Links</h3>
          <Link href="/privacy-policy" className="block hover:text-indigo-500">Privacy Policy</Link>
          <Link href="/terms-of-service" className="block hover:text-indigo-500">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
