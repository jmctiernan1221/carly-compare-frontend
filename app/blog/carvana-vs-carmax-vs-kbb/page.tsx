
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carvana vs CarMax vs KBB — Who Pays More?',
  description: 'We compare Carvana, CarMax, and Kelley Blue Book to find out who offers the best price when selling your car.',
};

export default function BlogPost() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">Carvana vs CarMax vs KBB — Who Pays More?</h1>

           <section className="space-y-6 text-lg leading-8">
          <p><strong>Carvana, CarMax, and Kelley Blue Book (KBB)</strong> all promise to give you a good deal when selling your car — but who actually delivers the best price?</p>

          <h2 className="text-2xl font-semibold mt-10">Quick Overview</h2>
          <ul className="list-disc pl-6">
            <li><strong>KBB</strong>: Good for estimates, but tends to offer lower trade-in values.</li>
            <li><strong>CarMax</strong>: In-person inspections and often the most competitive offers.</li>
            <li><strong>Carvana</strong>: Online convenience, instant offers, and free pickup.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10">Real Seller Example</h2>
          <p>Emily had a 2019 Toyota Camry with 42k miles:</p>
          <ul className="list-disc pl-6">
            <li>KBB: $17,200</li>
            <li>Carvana: $18,600</li>
            <li>CarMax: $19,100</li>
          </ul>
          <p>She used <strong>Carly Compare</strong> to get these quotes side-by-side and went with CarMax for the best price.</p>

          <h2 className="text-2xl font-semibold mt-10">Compare Offers Yourself</h2>
          <p>Use this quick table to track your offers:</p>
          <table className="table-auto border mt-4 w-full text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Provider</th>
                <th className="p-2 border">Offer Amount</th>
                <th className="p-2 border">Pickup Option</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">KBB</td>
                <td className="p-2 border">$________</td>
                <td className="p-2 border">No</td>
              </tr>
              <tr>
                <td className="p-2 border">Carvana</td>
                <td className="p-2 border">$________</td>
                <td className="p-2 border">Yes</td>
              </tr>
              <tr>
                <td className="p-2 border">CarMax</td>
                <td className="p-2 border">$________</td>
                <td className="p-2 border">No</td>
              </tr>
            </tbody>
          </table>

          <h2 className="text-2xl font-semibold mt-10">Final Thoughts</h2>
          <p>No one provider wins every time. That’s why Carly Compare helps you compare all three in seconds — so you can sell smarter.</p>

          <div className="bg-orange-100 text-orange-900 p-4 rounded-md mt-8 text-center font-semibold">
            🎉 <a href="/" className="underline">Join the Carly Compare waitlist</a> to get early access when we launch!
          </div>
        </section>
      </main>
    </>
  );
}
