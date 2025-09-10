import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Check, X } from "lucide-react";

interface Requests {
  id: number;
  university: string;
  type: string;
  date: string;
  contact: string;
}
interface API {
  ADMIN_API: string; // <-- expect this as a prop
}

const ReqView = ({ ADMIN_API }: API) => {
  const [requests, setRequests] = useState<Requests[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReqStats() {
      try {
        let url = `${ADMIN_API}api/admin/requests`;
        console.log("Fetching stats from:", url);
        // requests
        const reqRes = await fetch(url);
        if (!reqRes.ok) {
          throw new Error("Failed to fetch stats");
        }
        const reqData: Requests[] = await reqRes.json();
        setRequests(reqData);
      } catch (err) {
        // console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchReqStats();
  }, [ADMIN_API]);

  if (loading) {
    return <p>Loading requests...</p>;
  }

  if (!requests) {
    // return
    <p>Failed to load stats.</p>;
  }
  console.log(requests);

  const mockRequests = [
    {
      id: 1,
      university: "Yale University",
      type: "New Registration",
      date: "2024-01-15",
      contact: "admin@yale.edu",
    },
    {
      id: 2,
      university: "Princeton",
      type: "Access Request",
      date: "2024-01-14",
      contact: "it@princeton.edu",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Pending Requests</h1>
        <p className="text-muted-foreground">
          Review and approve university registration requests
        </p>
      </div>

      <div className="space-y-4">
        {mockRequests.map((request) => (
          <Card key={request.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{request.university}</h3>
                <p className="text-sm text-muted-foreground">{request.type}</p>
                <p className="text-sm text-muted-foreground">
                  Contact: {request.contact}
                </p>
                <p className="text-sm text-muted-foreground">
                  Date: {request.date}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button variant="outline" size="sm">
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReqView;
