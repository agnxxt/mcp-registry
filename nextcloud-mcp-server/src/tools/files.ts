import type { NextcloudClient } from "../client.js";
import type { Tool } from "../types.js";

export const tools: Tool[] = [
  {
    name: "list_files",
    description:
      "List files and folders at a given path in Nextcloud. Uses WebDAV PROPFIND. Returns XML with file metadata including size, type, and modification date.",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description:
            "Path relative to user root (e.g. '/' for root, '/Documents' for Documents folder). Defaults to '/'",
        },
      },
    },
    handler: async (
      client: NextcloudClient,
      args: Record<string, unknown>
    ) => {
      const user = client.getUsername();
      const path = (args.path as string) || "/";
      const davPath = `/remote.php/dav/files/${user}${path}`;
      return client.webdav(davPath, "PROPFIND", { Depth: "1" });
    },
  },
  {
    name: "upload_file",
    description:
      "Upload a file to Nextcloud. Provide the destination path and the file content as a string.",
    inputSchema: {
      type: "object",
      required: ["path", "content"],
      properties: {
        path: {
          type: "string",
          description:
            "Destination path including filename (e.g. '/Documents/notes.txt')",
        },
        content: {
          type: "string",
          description: "File content to upload",
        },
      },
    },
    handler: async (
      client: NextcloudClient,
      args: Record<string, unknown>
    ) => {
      const user = client.getUsername();
      const davPath = `/remote.php/dav/files/${user}${args.path}`;
      return client.webdav(
        davPath,
        "PUT",
        { "Content-Type": "application/octet-stream" },
        args.content as string
      );
    },
  },
  {
    name: "delete_file",
    description:
      "Delete a file or folder from Nextcloud by path. This action is permanent.",
    inputSchema: {
      type: "object",
      required: ["path"],
      properties: {
        path: {
          type: "string",
          description: "Path of the file or folder to delete",
        },
      },
    },
    handler: async (
      client: NextcloudClient,
      args: Record<string, unknown>
    ) => {
      const user = client.getUsername();
      const davPath = `/remote.php/dav/files/${user}${args.path}`;
      return client.webdav(davPath, "DELETE");
    },
  },
  {
    name: "create_folder",
    description: "Create a new folder in Nextcloud at the specified path.",
    inputSchema: {
      type: "object",
      required: ["path"],
      properties: {
        path: {
          type: "string",
          description: "Path for the new folder (e.g. '/Documents/Projects')",
        },
      },
    },
    handler: async (
      client: NextcloudClient,
      args: Record<string, unknown>
    ) => {
      const user = client.getUsername();
      const davPath = `/remote.php/dav/files/${user}${args.path}`;
      return client.webdav(davPath, "MKCOL");
    },
  },
  {
    name: "move_file",
    description:
      "Move or rename a file/folder in Nextcloud. Provide source and destination paths.",
    inputSchema: {
      type: "object",
      required: ["source", "destination"],
      properties: {
        source: {
          type: "string",
          description: "Current path of the file/folder",
        },
        destination: {
          type: "string",
          description: "New path for the file/folder",
        },
      },
    },
    handler: async (
      client: NextcloudClient,
      args: Record<string, unknown>
    ) => {
      const user = client.getUsername();
      const sourcePath = `/remote.php/dav/files/${user}${args.source}`;
      const destUrl = `${client.getBaseUrl()}/remote.php/dav/files/${user}${args.destination}`;
      return client.webdav(sourcePath, "MOVE", { Destination: destUrl });
    },
  },
  {
    name: "copy_file",
    description:
      "Copy a file or folder in Nextcloud. Provide source and destination paths.",
    inputSchema: {
      type: "object",
      required: ["source", "destination"],
      properties: {
        source: {
          type: "string",
          description: "Path of the file/folder to copy",
        },
        destination: {
          type: "string",
          description: "Destination path for the copy",
        },
      },
    },
    handler: async (
      client: NextcloudClient,
      args: Record<string, unknown>
    ) => {
      const user = client.getUsername();
      const sourcePath = `/remote.php/dav/files/${user}${args.source}`;
      const destUrl = `${client.getBaseUrl()}/remote.php/dav/files/${user}${args.destination}`;
      return client.webdav(sourcePath, "COPY", { Destination: destUrl });
    },
  },
];
