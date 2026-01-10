import { useMutation } from "convex/react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { api } from "../../../../convex/_generated/api";

interface ProfileImageUploadProps {
	/** Current profile image URL (from Convex storage) */
	profileImageUrl?: string;
	/** Fallback avatar URL (from identity provider) */
	avatarUrl?: string;
	/** User's name for fallback initials */
	name?: string;
	/** Size of the avatar */
	size?: "sm" | "md" | "lg";
}

const sizeClasses = {
	sm: "h-16 w-16",
	md: "h-20 w-20",
	lg: "h-24 w-24",
};

/**
 * Profile image upload component with preview.
 * Allows users to upload a custom profile picture stored in Convex.
 *
 * @example
 * <ProfileImageUpload
 *   profileImageUrl={user.profileImageUrl}
 *   avatarUrl={user.avatarUrl}
 *   name={user.name}
 * />
 */
export function ProfileImageUpload({
	profileImageUrl,
	avatarUrl,
	name,
	size = "md",
}: ProfileImageUploadProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);

	const generateUploadUrl = useMutation(api.users.generateUploadUrl);
	const updateProfileImage = useMutation(api.users.updateProfileImage);
	const removeProfileImage = useMutation(api.users.removeProfileImage);

	// Use profile image from Convex storage, fallback to identity provider avatar
	const displayImageUrl = profileImageUrl || avatarUrl;

	const initials = name
		? name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: "U";

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			alert("Please select an image file");
			return;
		}

		// Validate file size (max 5MB)
		const maxSize = 5 * 1024 * 1024;
		if (file.size > maxSize) {
			alert("Image must be less than 5MB");
			return;
		}

		setIsUploading(true);
		try {
			// Step 1: Get upload URL from Convex
			const uploadUrl = await generateUploadUrl();

			// Step 2: Upload file directly to Convex storage
			const response = await fetch(uploadUrl, {
				method: "POST",
				headers: { "Content-Type": file.type },
				body: file,
			});

			if (!response.ok) {
				throw new Error("Upload failed");
			}

			// Step 3: Get storage ID and update user profile
			const { storageId } = await response.json();
			await updateProfileImage({ storageId });
		} catch (error) {
			console.error("Upload error:", error);
			alert("Failed to upload image. Please try again.");
		} finally {
			setIsUploading(false);
			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	const handleRemove = async () => {
		if (!profileImageUrl) return;

		try {
			await removeProfileImage();
		} catch (error) {
			console.error("Remove error:", error);
			alert("Failed to remove image. Please try again.");
		}
	};

	return (
		<div className="flex items-center gap-4">
			<div className="relative">
				<Avatar className={sizeClasses[size]}>
					<AvatarImage src={displayImageUrl} alt={name || "Profile"} />
					<AvatarFallback className="text-lg">{initials}</AvatarFallback>
				</Avatar>

				{isUploading && (
					<div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/80">
						<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					</div>
				)}
			</div>

			<div className="space-y-1">
				<p className="text-sm font-medium">Profile Picture</p>
				<p className="text-xs text-muted-foreground">
					{profileImageUrl
						? "Custom image uploaded"
						: avatarUrl
							? "Using identity provider image"
							: "No image set"}
				</p>
				<div className="flex gap-2 pt-1">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => fileInputRef.current?.click()}
						disabled={isUploading}
					>
						<Camera className="mr-1.5 h-3.5 w-3.5" />
						{profileImageUrl ? "Change" : "Upload"}
					</Button>

					{profileImageUrl && (
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={handleRemove}
							disabled={isUploading}
						>
							<Trash2 className="mr-1.5 h-3.5 w-3.5" />
							Remove
						</Button>
					)}
				</div>
			</div>

			{/* Hidden file input */}
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleFileSelect}
				className="hidden"
			/>
		</div>
	);
}
