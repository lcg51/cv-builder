import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem
} from '@/components/ui/dropdown-menu';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';
import { ListFilter, MoreHorizontal, PlusCircle } from 'lucide-react';
import { useProducts } from './hooks/useProducts';

export default function Products() {
	const { products } = useProducts();

	return (
		<div className="flex flex-1 flex-col gap-4">
			<Tabs defaultValue="all">
				<div className="flex items-center">
					<TabsList>
						<TabsTrigger value="all">All</TabsTrigger>
						<TabsTrigger value="active">Active</TabsTrigger>
						<TabsTrigger value="draft">Draft</TabsTrigger>
						<TabsTrigger value="archived" className="hidden sm:flex">
							Archived
						</TabsTrigger>
					</TabsList>
					<div className="ml-auto flex items-center gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm" className="h-8 gap-1">
									<ListFilter className="h-3.5 w-3.5" />
									<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Filter by</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuCheckboxItem checked>Active</DropdownMenuCheckboxItem>
								<DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
								<DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<Button size="sm" className="h-8 gap-1">
							<PlusCircle className="h-3.5 w-3.5" />
							<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Product</span>
						</Button>
					</div>
				</div>
				{products.length > 0 ? (
					<TabsContent value="all">
						<Card x-chunk="dashboard-06-chunk-0">
							<CardHeader>
								<CardTitle>Products</CardTitle>
								<CardDescription>
									Manage your products and view their sales performance.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="hidden w-[100px] sm:table-cell">
												<span className="sr-only">Image</span>
											</TableHead>
											<TableHead>Name</TableHead>
											<TableHead>Status</TableHead>
											<TableHead className="hidden md:table-cell">Price</TableHead>
											<TableHead className="hidden md:table-cell">Total Sales</TableHead>
											<TableHead className="hidden md:table-cell">Created at</TableHead>
											<TableHead>
												<span className="sr-only">Actions</span>
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{products.map(product => (
											<TableRow key={product.id}>
												<TableCell className="hidden sm:table-cell">
													<Image
														alt="Product image"
														className="aspect-square rounded-md object-cover"
														height="64"
														src="/assets/placeholder.svg"
														width="64"
													/>
												</TableCell>
												<TableCell className="font-medium">{product.name}</TableCell>
												<TableCell>
													<Badge
														variant={product.status === 'Active' ? 'outline' : 'secondary'}
													>
														{product.status}
													</Badge>
												</TableCell>
												<TableCell className="hidden md:table-cell">${product.price}</TableCell>
												<TableCell className="hidden md:table-cell">25</TableCell>
												<TableCell className="hidden md:table-cell">
													{product.createdAt}
												</TableCell>
												<TableCell>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button aria-haspopup="true" size="icon" variant="ghost">
																<MoreHorizontal className="h-4 w-4" />
																<span className="sr-only">Toggle menu</span>
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuLabel>Actions</DropdownMenuLabel>
															<DropdownMenuItem>Edit</DropdownMenuItem>
															<DropdownMenuItem>Delete</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
							<CardFooter>
								<div className="text-xs text-muted-foreground">
									Showing <strong>1-10</strong> of <strong>32</strong> products
								</div>
							</CardFooter>
						</Card>
					</TabsContent>
				) : (
					<div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
						<div className="flex flex-col items-center gap-1 text-center">
							<h3 className="text-2xl font-bold tracking-tight">You have no products</h3>
							<p className="text-sm text-muted-foreground">
								You can start selling as soon as you add a product.
							</p>
						</div>
					</div>
				)}
			</Tabs>
		</div>
	);
}
