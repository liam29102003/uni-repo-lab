
import * as Dialog from "@radix-ui/react-dialog";
import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";

export default function CommentComp({parentId,parentType}) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [comment, setComment] = useState("");

  const userId = "64f9a2b7c5e4f123456789ab";
  // const parentId = "68bfac12249e8b4fc045b596";

 const handlePostComment = async () => {
    try {
      const response = await fetch("http://localhost:8070/api/questions/save_comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: comment,
          createdBy: userId,
          parentType: parentType,
          parentId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      const data = await response.json();
      // console.log(data)
      fetchComments()
      setComment(""); // reset textarea
    } catch (err) {
      console.error(err);
      alert("Error posting comment");
    }
  };

  const fetchComments = async() =>{
      fetch(`http://localhost:8070/api/questions/get/all/comments?parentId=${parentId}&parentType=${parentType}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          setComments(data || []);
        })
        .catch((err) => {
          console.error(err);
          setComments([]);
        });
    }

  useEffect(()=>{
    fetchComments();
  },[])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <div className="flex items-center space-x-1 text-muted-foreground underline hover:text-blue-400 cursor-pointer">
          <MessageSquare className="w-4 h-4" />
          <span>Comments</span>
        </div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />

        <Dialog.Content
          className="fixed top-1/2 left-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2
                     bg-white p-6 rounded-xl shadow-lg focus:outline-none z-50"
        >
          <Dialog.Title className="text-lg font-bold">Comments</Dialog.Title>

          {/* Textarea + Buttons */}
          <div className="mt-4">
            <textarea
              className="border border-gray-300 w-full rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              rows={4}
              placeholder="Write your comment..." onChange={(e)=>setComment(e.target.value)}
            />

            <div className="flex items-center mt-3 space-x-3">
              <button className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-400" onClick={handlePostComment}>
                Post Comment
              </button>
              <Dialog.Close asChild>
                <button className="px-3 py-1.5 bg-gray-200 rounded-lg hover:bg-gray-300">
                  Close
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Scrollable Comment List */}
          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2">Previous Comments</h3>
            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {/* Example comments */}
              {
                comments?.length > 0 ?(
                    comments?.map((comment,index)=>(
                        <li key={index} className="p-3 rounded-lg border bg-gray-50">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">{comment?.createdByName}</span>
                          <span className="text-xs text-gray-400">
                            {
                               new Date(comment.createdAt).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                            }
                          </span>
                        </div>
                        <p className="mt-2 text-gray-700 text-sm">
                          {comment?.body}
                        </p>
                      </li>
               ))
                ):(
                     <li className="p-3 rounded-lg border bg-gray-50">
                        <p className="mt-2 text-gray-700 text-sm">
                          No comment yet!
                        </p>
                      </li>
                )
              }
             
              
            </ul>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
